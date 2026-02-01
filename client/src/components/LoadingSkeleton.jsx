export default function LoadingSkeleton({ count = 3, type = 'card' }) {
    return (
        <div className="space-y-4 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`bg-elevated rounded-lg ${type === 'card' ? 'h-32' : 'h-16'
                        } w-full opacity-50`}
                />
            ))}
        </div>
    );
}
