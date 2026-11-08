import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { gmailCompose } from "../lib/contact";
export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [topic, setTopic] = useState("A project"),
    [status, setStatus] = useState(""),
    [copied, setCopied] = useState(false);
  function draft() {
    const data = new FormData(form.current!);
    return {
      subject: `${topic} — ${String(data.get("name")).trim()}`,
      body: `Hi Dorsa,\n\n${String(data.get("message")).trim()}\n\n${String(data.get("name")).trim()}`,
    };
  }
  function validate() {
    const name = form.current!.elements.namedItem("name") as HTMLInputElement;
    const message = form.current!.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;
    name.setCustomValidity(name.value.trim() ? "" : "Please enter your name.");
    message.setCustomValidity(
      message.value.trim().length >= 10
        ? ""
        : "Please write at least 10 characters.",
    );
    return form.current!.reportValidity();
  }
  async function copyDraft() {
    if (!validate()) return;
    const text = draft();
    try {
      await navigator.clipboard.writeText(
        `To: dorrsakhalili@gmail.com\nSubject: ${text.subject}\n\n${text.body}`,
      );
      setCopied(true);
      setStatus("Draft copied.");
    } catch {
      setStatus("Please use the Gmail button to open your draft.");
    }
  }
  return (
    <form
      ref={form}
      className="contact-letter"
      onInput={(event) => {
        const input = event.target;
        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLTextAreaElement
        )
          input.setCustomValidity("");
        setStatus("");
        setCopied(false);
      }}
      onSubmit={(event) => {
        event.preventDefault();
        if (!validate()) return;
        const text = draft();
        window.open(
          gmailCompose(text.subject, text.body),
          "_blank",
          "noopener,noreferrer",
        );
        setStatus("Review your draft in Gmail, then send it.");
      }}
    >
      <div className="letter-top">
        <span>TO: DORSA</span>
        <span className="letter-stamp">
          DK<span>↗</span>
        </span>
      </div>
      <p className="letter-greeting">
        Hi Dorsa<span>,</span>
      </p>
      <label className="sentence-label" htmlFor="contact-name">
        I’m{" "}
        <input
          id="contact-name"
          name="name"
          aria-label="Your name"
          autoComplete="name"
          placeholder="your name"
          required
          maxLength={100}
        />
        <span>.</span>
      </label>
      <fieldset className="contact-topics">
        <legend>Let’s talk about</legend>
        <div>
          {["A project", "An opportunity", "Something else"].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="topic"
                value={value}
                checked={topic === value}
                onChange={() => setTopic(value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="sr-only" htmlFor="contact-message">
        Your message
      </label>
      <textarea
        id="contact-message"
        name="message"
        placeholder="Here’s what I have in mind…"
        required
        minLength={10}
        maxLength={4000}
        rows={3}
      />
      <div className="letter-actions">
        <button type="submit" className="letter-send">
          Open Gmail <ArrowUpRight size={20} />
        </button>
        <button
          type="button"
          className="draft-copy"
          onClick={copyDraft}
          aria-label={copied ? "Draft copied" : "Copy email draft"}
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
        </button>
      </div>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
