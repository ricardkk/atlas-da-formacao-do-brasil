import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface EditorialSelectOption {
  readonly value: string;
  readonly label: string;
  readonly color?: string;
  readonly meta?: string;
}

export interface EditorialSelectGroup {
  readonly label: string;
  readonly subtitle?: string;
  readonly options: readonly EditorialSelectOption[];
}

export interface EditorialSelectProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly prefixLabel: string;
  readonly allOptionLabel: string;
  readonly allValue?: string;
  readonly groups?: readonly EditorialSelectGroup[];
  readonly options?: readonly EditorialSelectOption[];
  readonly icon?: ReactNode;
  readonly ariaLabel: string;
  readonly maxWidthClassName?: string;
  readonly menuWidthClassName?: string;
}

export function EditorialSelect({
  value,
  onChange,
  prefixLabel,
  allOptionLabel,
  allValue = '',
  groups,
  options,
  icon,
  ariaLabel,
  maxWidthClassName = 'max-w-[220px]',
  menuWidthClassName = 'w-64',
}: EditorialSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const flatOptions = useMemo<readonly EditorialSelectOption[]>(() => {
    const list: EditorialSelectOption[] = [
      { value: allValue, label: allOptionLabel },
    ];
    if (groups) {
      for (const group of groups) {
        for (const opt of group.options) {
          list.push(opt);
        }
      }
    } else if (options) {
      for (const opt of options) {
        list.push(opt);
      }
    }
    return list;
  }, [allOptionLabel, allValue, groups, options]);

  const selectedOption = useMemo(
    () => flatOptions.find((opt) => opt.value === value) ?? flatOptions[0],
    [flatOptions, value]
  );

  const isFiltered = value !== allValue;

  const closeMenu = useCallback((returnFocus = false) => {
    setIsOpen(false);
    setFocusedIndex(-1);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const handleSelect = useCallback(
    (nextValue: string) => {
      onChange(nextValue);
      closeMenu(true);
    },
    [closeMenu, onChange]
  );

  // Listener de clique externo ativo apenas enquanto o menu está aberto
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        const currentIdx = flatOptions.findIndex((o) => o.value === value);
        setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
        setIsOpen(true);
        return;
      }
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      setFocusedIndex((prev) => {
        const start = prev < 0 ? 0 : prev;
        return (start + delta + flatOptions.length) % flatOptions.length;
      });
    } else if (e.key === 'Home' && isOpen) {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End' && isOpen) {
      e.preventDefault();
      setFocusedIndex(flatOptions.length - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && isOpen && focusedIndex >= 0) {
      e.preventDefault();
      const target = flatOptions[focusedIndex];
      if (target) handleSelect(target.value);
    }
  };

  let runningIndex = 0;

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => {
          setIsOpen((prev) => {
            if (!prev) {
              const currentIdx = flatOptions.findIndex((o) => o.value === value);
              setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
            }
            return !prev;
          });
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus:outline-none ${maxWidthClassName} ${
          isOpen
            ? 'border-terracotta/65 bg-parchment text-ink shadow-sm ring-1 ring-terracotta/20'
            : isFiltered
              ? 'border-terracotta/45 bg-parchment-surface text-ink hover:bg-parchment-surface'
              : 'border-parchment-border bg-parchment text-ink hover:bg-parchment-surface hover:border-terracotta/35'
        }`}
      >
        {selectedOption?.color ? (
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: selectedOption.color }}
            aria-hidden="true"
          />
        ) : (
          icon && (
            <span className="text-ink-muted shrink-0" aria-hidden="true">
              {icon}
            </span>
          )
        )}

        <span className="truncate">
          {!isFiltered && (
            <span className="text-ink-muted font-normal">{prefixLabel}: </span>
          )}
          <span>{selectedOption?.label ?? allOptionLabel}</span>
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-ink-muted shrink-0 transition-transform duration-150 ease-out motion-reduce:transition-none ${
            isOpen ? 'rotate-180 text-terracotta' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Menu flutuante com animação GPU-only (opacity + transform) */}
      <div
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
        className={`absolute left-0 top-full mt-1.5 z-50 ${menuWidthClassName} origin-top rounded-md border border-parchment-border border-t-2 border-t-terracotta/60 bg-parchment py-1.5 shadow-lg transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-1 scale-[0.98] pointer-events-none'
        }`}
      >
        <div className="max-h-72 overflow-y-auto px-1">
          {/* Opção padrão ("Todas" / "Todos") */}
          {(() => {
            const idx = runningIndex++;
            const isSelected = value === allValue;
            const isFocused = focusedIndex === idx;
            return (
              <button
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                onClick={() => handleSelect(allValue)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`w-full flex items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left text-xs transition-colors duration-100 ${
                  isSelected
                    ? 'bg-terracotta/12 font-semibold text-ink'
                    : isFocused
                      ? 'bg-parchment-surface/90 text-ink'
                      : 'text-ink-muted hover:bg-parchment-surface/80 hover:text-ink'
                }`}
              >
                <span className="truncate">
                  {prefixLabel}: {allOptionLabel}
                </span>
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 text-terracotta shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })()}

          {groups ? (
            groups.map((group) => (
              <div
                key={group.label}
                className="mt-1.5 pt-1.5 border-t border-parchment-border/70"
              >
                <div className="px-2.5 pb-1 flex items-baseline justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    {group.label}
                  </span>
                  {group.subtitle && (
                    <span className="font-serif italic text-[11px] text-ink-muted/90 truncate">
                      {group.subtitle}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  {group.options.map((opt) => {
                    const idx = runningIndex++;
                    const isSelected = value === opt.value;
                    const isFocused = focusedIndex === idx;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        tabIndex={-1}
                        aria-selected={isSelected}
                        onClick={() => handleSelect(opt.value)}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        className={`w-full flex items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left text-xs transition-colors duration-100 ${
                          isSelected
                            ? 'bg-terracotta/12 font-semibold text-ink'
                            : isFocused
                              ? 'bg-parchment-surface/90 text-ink'
                              : 'text-ink hover:bg-parchment-surface/80'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {opt.color && (
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: opt.color }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate">{opt.label}</span>
                        </span>
                        {isSelected && (
                          <Check
                            className="w-3.5 h-3.5 text-terracotta shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="mt-1 pt-1 border-t border-parchment-border/70 space-y-0.5">
              {options?.map((opt) => {
                const idx = runningIndex++;
                const isSelected = value === opt.value;
                const isFocused = focusedIndex === idx;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`w-full flex items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left text-xs transition-colors duration-100 ${
                      isSelected
                        ? 'bg-terracotta/12 font-semibold text-ink'
                        : isFocused
                          ? 'bg-parchment-surface/90 text-ink'
                          : 'text-ink hover:bg-parchment-surface/80'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {opt.color && (
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: opt.color }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5 text-terracotta shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorialSelect;
