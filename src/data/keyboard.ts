import { tools } from "./workbench";
export type KeyboardKey = {
  label: string;
  x: number;
  z: number;
  width: number;
  tool?: (typeof tools)[number];
  action?: "work" | "contact";
};
export const keyboardKeys: KeyboardKey[] = [];
const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
rows.forEach((row, r) => {
  const offset = [0, 0.25, 1][r];
  [...row].forEach((label, i) =>
    keyboardKeys.push({
      label,
      x: (i + offset - 4.6) * 1.06,
      z: (r - 1.5) * 1.06,
      width: 1,
      tool: tools.find((t) => t.shortcut === label && t.id !== "contact"),
    }),
  );
});
keyboardKeys.push(
  { label: "shift", x: -5.1, z: 0.53, width: 1.1 },
  {
    label: "enter ↗",
    x: 4.3,
    z: 0.53,
    width: 1.9,
    tool: tools.find((t) => t.id === "contact"),
    action: "contact",
  },
);
keyboardKeys.push(
  { label: "ctrl", x: -4.9, z: 1.59, width: 1 },
  { label: "alt", x: -3.75, z: 1.59, width: 1 },
  {
    label: "selected work ↓",
    x: -0.35,
    z: 1.59,
    width: 5.2,
    tool: tools.find((t) => t.id === "work"),
    action: "work",
  },
  { label: "←", x: 3, z: 1.59, width: 1 },
  { label: "→", x: 4.15, z: 1.59, width: 1 },
);
