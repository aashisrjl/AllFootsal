import React from "react";

interface SentimentBadgeProps {
    score?: number | null;
    label?: string | null;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({
    score,
    label,
}) => {
    if (score == null) return null;

    // Format score as percentage
    const percentage = Math.round(score * 100);

    // Default label if not provided
    const displayLabel =
        label ||
        (score >= 0.6 ? "Positive" : score <= 0.4 ? "Negative" : "Neutral");

    // Logic for colors based on the label (case insensitive)
    const normalizedLabel = displayLabel.toLowerCase();
    let colors = "bg-background text-muted-foreground border-border shadow-sm";

    if (normalizedLabel.includes("pos")) {
        colors = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20 shadow-sm";
    } else if (normalizedLabel.includes("neg")) {
        colors = "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-100 dark:border-red-500/20 shadow-sm";
    } else if (normalizedLabel.includes("neu") || normalizedLabel.includes("mix")) {
        colors = "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-100 dark:border-amber-500/20 shadow-sm";
    }

    return (
        <div className="flex items-center gap-1.5 shrink-0">
            <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${colors} flex items-center gap-1`}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                {percentage}% {displayLabel}
            </span>
        </div>
    );
};

export default SentimentBadge;
