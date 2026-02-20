import { useState, useEffect, useCallback } from 'react';
import type { AppScreen, ValuationResult } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { calculateValuation } from './engine/valuationEngine';
import { useSurveyState } from './hooks/useSurveyState';
import { surveySections } from './data/questions';
import LandingHero from './components/LandingHero';
import Survey from './components/Survey';
import Results from './components/Results';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [concentrationRisk, setConcentrationRisk] = useState(false);

  const {
    state,
    setEmail,
    setEvaluationId,
    setAnswer,
    nextSection,
    prevSection,
    restoreState,
    isLastSection,
    isFirstSection,
    answers,
  } = useSurveyState();

  // Handle ?resume=<evaluation_id> URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get('resume');
    if (!resumeId || !isSupabaseConfigured) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('evaluations')
          .select('*')
          .eq('id', resumeId)
          .single();

        if (error || !data) return;

        restoreState({
          evaluationId: data.id,
          email: data.email,
          currentSection: data.current_section || 0,
          answers: data.answers || {},
        });
        setScreen('survey');

        // Clean the URL
        window.history.replaceState({}, '', window.location.pathname);
      } catch {
        // Resume failed silently — user starts fresh
      }
    })();
  }, [restoreState]);

  const handleEmailSubmit = useCallback(async (email: string) => {
    setEmail(email);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('evaluations')
          .insert({
            email,
            status: 'started',
            current_section: 0,
            answers: {},
            abandoned_email_count: 0,
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) {
          setEvaluationId(data.id);
        }
      } catch {
        console.warn('Supabase insert failed — running in demo mode');
      }
    }

    setScreen('survey');
  }, [setEmail, setEvaluationId]);

  const saveProgress = useCallback(async (section: number) => {
    if (!state.evaluationId || !isSupabaseConfigured) return;
    try {
      await supabase
        .from('evaluations')
        .update({
          current_section: section,
          answers: state.answers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.evaluationId);
    } catch {
      // Silent fail — non-blocking
    }
  }, [state.evaluationId, state.answers]);

  const handleNext = useCallback(() => {
    const nextSectionIndex = state.currentSection + 1;
    nextSection();
    saveProgress(nextSectionIndex);
  }, [state.currentSection, nextSection, saveProgress]);

  const handleComplete = useCallback(async () => {
    setScreen('calculating');

    const result = calculateValuation(state.answers);
    setValuationResult(result);

    // Check concentration risk
    const topClient = state.answers.top_client_concentration as string;
    const hasRisk = ['25_40', '40_60', 'over_60'].includes(topClient);
    setConcentrationRisk(hasRisk);

    // Save completed evaluation to Supabase
    if (state.evaluationId && isSupabaseConfigured) {
      try {
        await supabase
          .from('evaluations')
          .update({
            status: 'completed',
            answers: state.answers,
            current_section: surveySections.length - 1,
            valuation_low: result.valuationLow,
            valuation_high: result.valuationHigh,
            ebitda_multiple_low: result.ebitdaMultipleLow,
            ebitda_multiple_high: result.ebitdaMultipleHigh,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', state.evaluationId);

        // Trigger email Edge Function
        try {
          await supabase.functions.invoke('send-results-email', {
            body: {
              evaluationId: state.evaluationId,
              email: state.email,
              valuationLow: result.valuationLow,
              valuationHigh: result.valuationHigh,
              ebitdaMultipleLow: result.ebitdaMultipleLow,
              ebitdaMultipleHigh: result.ebitdaMultipleHigh,
              estimatedEbitda: result.estimatedEbitda,
            },
          });
        } catch {
          // Email sending is non-blocking
        }
      } catch {
        // Non-blocking — results still displayed
      }
    }

    // Brief delay for the "calculating" animation
    setTimeout(() => {
      setScreen('results');
    }, 2000);
  }, [state.answers, state.evaluationId, state.email]);

  if (screen === 'landing') {
    return <LandingHero onSubmit={handleEmailSubmit} />;
  }

  if (screen === 'survey') {
    return (
      <Survey
        currentSection={state.currentSection}
        answers={answers}
        onAnswer={setAnswer}
        onNext={handleNext}
        onBack={prevSection}
        onComplete={handleComplete}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
      />
    );
  }

  if (screen === 'calculating') {
    return <CalculatingScreen />;
  }

  if (screen === 'results' && valuationResult) {
    return <Results result={valuationResult} hasConcentrationRisk={concentrationRisk} />;
  }

  return null;
}

function CalculatingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-primary)',
      color: '#fff',
      fontFamily: 'var(--font-family)',
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '4px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 24,
      }} />
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Calculating Your Valuation
      </h2>
      <p style={{ fontSize: 15, opacity: 0.8 }}>
        Analyzing your responses against market data...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
