import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <span className={styles.wrapper}>
      <span className={styles.trigger} tabIndex={0} role="button" aria-label="More info">
        ?
      </span>
      <span className={styles.content} role="tooltip">
        {text}
      </span>
    </span>
  );
}
