"use client";

import { useEffect, useState } from "react";

export function EditableField({
  value,
  save,
  multiline = false,
  className = "live-field",
  label,
  placeholder,
}: {
  value: string;
  save: (next: string) => Promise<{ error?: string } | void>;
  multiline?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}) {
  const [text, setText] = useState(value);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  async function commit() {
    if (text === value) return;
    const result = await save(text);
    setNote(result?.error ?? "已保存");
  }

  return (
    <label className="live-label">
      {label ? <span className="live-label-text">{label}</span> : null}
      {multiline ? (
        <textarea
          className={className}
          value={text}
          placeholder={placeholder}
          rows={Math.min(8, Math.max(2, text.split("\n").length))}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => void commit()}
        />
      ) : (
        <input
          className={className}
          value={text}
          placeholder={placeholder}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => void commit()}
        />
      )}
      {note ? <span className="live-note">{note}</span> : null}
    </label>
  );
}

export function EditablePair({
  first,
  second,
  save,
  firstClass = "live-field",
  secondClass = "live-field",
  secondMultiline = true,
  firstPlaceholder,
  secondPlaceholder,
}: {
  first: string;
  second: string;
  save: (first: string, second: string) => Promise<{ error?: string } | void>;
  firstClass?: string;
  secondClass?: string;
  secondMultiline?: boolean;
  firstPlaceholder?: string;
  secondPlaceholder?: string;
}) {
  const [a, setA] = useState(first);
  const [b, setB] = useState(second);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setA(first);
    setB(second);
  }, [first, second]);

  async function commit(nextA: string, nextB: string) {
    if (nextA === first && nextB === second) return;
    const result = await save(nextA, nextB);
    setNote(result?.error ?? "已保存");
  }

  return (
    <div className="live-pair">
      <input
        className={firstClass}
        value={a}
        placeholder={firstPlaceholder}
        onChange={(event) => setA(event.target.value)}
        onBlur={() => void commit(a, b)}
      />
      {secondMultiline ? (
        <textarea
          className={secondClass}
          value={b}
          placeholder={secondPlaceholder}
          rows={Math.min(8, Math.max(2, b.split("\n").length))}
          onChange={(event) => setB(event.target.value)}
          onBlur={(event) => void commit(a, event.target.value)}
        />
      ) : (
        <input
          className={secondClass}
          value={b}
          placeholder={secondPlaceholder}
          onChange={(event) => setB(event.target.value)}
          onBlur={(event) => void commit(a, event.target.value)}
        />
      )}
      {note ? <span className="live-note">{note}</span> : null}
    </div>
  );
}
