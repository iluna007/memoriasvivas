export default function SortToolbar({ sortBy, onSort, optionsMap }) {
  const keys = Object.keys(optionsMap)
  return (
    <div className="flex flex-wrap gap-1 border-b border-zinc-500/25 bg-black/[0.03] px-2 py-1.5 sm:px-3 sm:py-2">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSort(key)}
          className={
            'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ' +
            (sortBy === key
              ? 'bg-white/15 text-inherit'
              : 'text-inherit/70 hover:bg-white/10 hover:text-inherit')
          }
        >
          {optionsMap[key].label}
        </button>
      ))}
    </div>
  )
}
