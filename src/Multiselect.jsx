import { useEffect, useRef, useState } from 'react';

export default function Multiselect({
    options,
    selectedOptions,
    onSelectionChange,
    placeholder = 'Select...',
}) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const filtered = () => {
        const q = searchValue.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
    };

    const isSelected = (value) => selectedOptions.includes(value);

    const toggleValue = (value) => {
        if (isSelected(value)) {
            onSelectionChange(selectedOptions.filter((v) => v !== value));
        } else {
            onSelectionChange([...selectedOptions, value]);
        }
    };

    const removeValue = (value) => onSelectionChange(selectedOptions.filter((v) => v !== value));

    const clearAll = () => onSelectionChange([]);

    useEffect(() => {
        const onDocClick = (e) => {
            // if (!containerRef.current || e.target.closest('#expandedButton')) return;
            if (!containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
            setHighlightedIndex(0);
        }
    }, [open]);

    return (
        <div className="w-full max-w-full" ref={containerRef}>
            <div className="mb-2 flex flex-wrap gap-2 flex-col md:flex-row justify-center items-center">
                {selectedOptions.map((val) => {
                    const opt = options.find((o) => o.value === val);
                    const label = opt?.label ?? val;
                    return (
                        <span
                            key={val}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 pl-3 pr-1 py-1 text-sm text-slate-800 ring-1 ring-slate-200"
                        >
                            {label}
                            <button
                                onClick={() => removeValue(val)}
                                className="ml-1 rounded-full hover:bg-slate-200 cursor-pointer w-5 h-5 flex justify-center items-center"
                                aria-label={`Remove ${label}`}
                                title="Remove"
                            >
                                ×
                            </button>
                        </span>
                    );
                })}
                {selectedOptions.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="ml-1 text-sm text-blue-600 hover:underline cursor-pointer"
                        title="Clear all"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <button
                type="button"
                id="expandedButton"
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-slate-900 shadow-sm hover:border-slate-400 focus:outline-none"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                <span className={selectedOptions.length === 0 ? 'text-slate-400' : ''}>
                    {selectedOptions.length === 0 ? placeholder : `Selected: ${selectedOptions.length}`}
                </span>
                <svg
                    className={`cursor-pointer transition-transform duration-200 ${
                        open ? 'rotate-180' : 'rotate-0'
                    }`}
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    aria-hidden
                >
                    <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </button>

            {open && (
                <div className="relative z-10">
                    <div className="absolute mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                        <div className="p-2 relative">
                            <input
                                ref={inputRef}
                                id="searchInput"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search…"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                            />

                            {searchValue.trim() !== '' && (
                                <button
                                    type="button"
                                    onClick={() => setSearchValue('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-slate-500 hover:bg-slate-200 cursor-pointer flex items-center justify-center leading-none"
                                    aria-label="Clear search"
                                    title="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <ul
                            id={'listbox'}
                            aria-multiselectable="true"
                            className="max-h-64 overflow-auto py-1"
                        >
                            {options.length === 0 && (
                                <li className="px-3 py-2 text-sm text-slate-500">
                                    There are no available options
                                </li>
                            )}

                            {options.length > 0 && filtered().length === 0 && (
                                <li className="px-3 py-2 text-sm text-slate-500">Nothing was found</li>
                            )}

                            {filtered().map((opt, idx) => {
                                const active = idx === highlightedIndex;
                                const selected = isSelected(opt.value);
                                return (
                                    <li
                                        key={opt.value}
                                        role="option"
                                        aria-selected={selected}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                        onClick={() => toggleValue(opt.value)}
                                        className={[
                                            'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                                            active ? 'bg-slate-100' : '',
                                            selected ? 'hidden' : '',
                                        ].join(' ')}
                                    >
                                        {/* <input
                                            type="checkbox"
                                            readOnly
                                            checked={selected}
                                            className="h-4 w-4"
                                        /> */}

                                        <img
                                            src="src/assets/check.png"
                                            className={`w-4 ${selected ? '' : 'hidden'}`}
                                        ></img>
                                        <img
                                            src="src/assets/uncheck.png"
                                            className={`w-4 ${selected ? 'hidden' : ''}`}
                                        ></img>
                                        <span className="text-slate-800">{opt.label}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
