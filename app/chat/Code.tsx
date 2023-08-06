import * as PrismLanguages from "react-syntax-highlighter/dist/esm/languages/prism";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";

interface CodeInputProps {
  children: string;
  className: string;
}

if (
  PrismLanguages &&
  typeof PrismLanguages === "object" &&
  Object.keys(PrismLanguages).length > 0
) {
  Object.entries(PrismLanguages).forEach(([langName, langModule]) => {
    try {
      if (langName && langModule && langModule !== undefined) {
        SyntaxHighlighter.registerLanguage(langName, langModule);
      } else {
        console.log(`Language module for ${langName} is undefined`);
      }
    } catch {
      console.log("Error");
    }
  });
}

const Code: React.FC<CodeInputProps> = (props) => {
  const { children, className: language } = props;
  const lang = language?.replace("lang-", "");

  return (
    <>
      {/* <CopyToClipboard text={children} onCopy={() => setCopied(true)}>
        <button className="icon copy-icon">
          {copied ? <PasteIcon /> : <CopyIcon />}
        </button>
      </CopyToClipboard> */}

      {lang ? (
        <>
          <div className="flex justify-between bg-slate-500 -mb-[0.5em] p-2 rounded-tl-md rounded-tr-md text-white">
            <div>{lang}</div>
            <button
              className="float-right hover:text-gray-400"
              onClick={() => {
                navigator.clipboard.writeText(children);
                toast("Code copied to clipboard", {
                  icon: "✂️",
                });
              }}
            >
              Copy
            </button>
          </div>
          <SyntaxHighlighter language={lang} style={tomorrow}>
            {children}
          </SyntaxHighlighter>
        </>
      ) : (
        <span className="font-bold">{children}</span>
      )}
    </>
  );
};

export default Code;
