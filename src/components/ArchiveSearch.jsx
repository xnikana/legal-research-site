import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { categories } from '../data/mockDocuments';
import { searchArchive } from '../utils/searchArchive';
import SearchHitRow from './SearchHitRow';

const PREVIEW_LIMIT = 5;

/**
 * @param {{
 *   query: string,
 *   onQueryChange: (value: string) => void,
 *   onCommitSearch?: (query: string) => void,
 *   categoryId?: string | null,
 * }} props
 */
export default function ArchiveSearch({ query, onQueryChange, onCommitSearch, categoryId = null }) {
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-list`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const scopedLabel = useMemo(() => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId)?.title ?? null;
  }, [categoryId]);

  const { results: previewResults, total } = useMemo(
    () => searchArchive(query, PREVIEW_LIMIT, categoryId),
    [query, categoryId],
  );

  const showPanel = open && query.trim().length >= 2;

  const activeRow =
    activeIndex >= 0 && activeIndex < previewResults.length ? activeIndex : -1;

  const commit = useCallback(
    (q) => {
      const t = q.trim();
      onCommitSearch?.(t.length >= 2 ? t : '');
      setOpen(false);
    },
    [onCommitSearch],
  );

  useEffect(() => {
    if (!showPanel) return;
    const onDocMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [showPanel]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        const t = query.trim();
        if (t.length >= 2 && onCommitSearch) {
          e.preventDefault();
          commit(query);
        }
        return;
      }
      if (!showPanel || previewResults.length === 0) {
        if (e.key === 'Escape') setOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => {
          if (previewResults.length === 0) return -1;
          if (i < 0) return 0;
          return Math.min(i + 1, previewResults.length - 1);
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [showPanel, previewResults.length, query, commit, onCommitSearch],
  );

  return (
    <div className="archive-search" ref={wrapRef}>
      <label htmlFor={inputId} className="visually-hidden">
        Search archive
      </label>
      <div className="archive-search-field">
        <Search className="archive-search-icon" size={18} aria-hidden />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          className="archive-search-input"
          placeholder={
            categoryId
              ? scopedLabel
                ? `Search only in “${scopedLabel}”… (Enter filters this list)`
                : 'Search this category… (Enter filters this list)'
              : onCommitSearch
                ? 'Search all categories — titles, paths, and text… (Enter filters this page)'
                : 'Search all categories — titles, paths, and text…'
          }
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listId : undefined}
          aria-autocomplete="list"
        />
        {query ? (
          <button
            type="button"
            className="archive-search-clear"
            aria-label="Clear search"
            onClick={() => {
              onQueryChange('');
              setActiveIndex(-1);
              setOpen(false);
              onCommitSearch?.('');
              inputRef.current?.focus();
            }}
          >
            <X size={16} aria-hidden />
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div
          id={listId}
          className="archive-search-panel"
          role="listbox"
          aria-label="Search results"
        >
          {previewResults.length === 0 ? (
            <div className="archive-search-empty">No matches for that search.</div>
          ) : (
            <>
              <div className="archive-search-meta">
                {categoryId && scopedLabel ? (
                  <span className="archive-search-scope">
                    Searching <strong>{scopedLabel}</strong> only
                    <span aria-hidden> · </span>
                  </span>
                ) : null}
                {total > PREVIEW_LIMIT
                  ? `Preview: ${PREVIEW_LIMIT} of ${total} matches${
                      onCommitSearch ? ' — Enter or “View all” for full list on this page' : ''
                    }`
                  : `${total} match${total === 1 ? '' : 'es'}${
                      onCommitSearch ? ' — press Enter to filter this page' : ''
                    }`}
              </div>
              <div className="archive-search-body">
                <ul className="archive-search-results">
                  {previewResults.map((row, index) => (
                    <li key={`${row.categoryId}-${row.doc.id}`} role="presentation">
                      <SearchHitRow
                        row={row}
                        searchQuery={query}
                        onNavigate={() => setOpen(false)}
                        active={index === activeRow}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {total > PREVIEW_LIMIT && onCommitSearch ? (
                <div className="archive-search-footer">
                  <button
                    type="button"
                    className="archive-search-view-all"
                    onClick={() => commit(query)}
                  >
                    View all {total} results on this page
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
