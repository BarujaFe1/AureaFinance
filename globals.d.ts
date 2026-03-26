declare module "*.css";

declare module "next/navigation" {
  export function redirect(path: string): never;
  export function useRouter(): { refresh(): void; push(path: string): void; replace(path: string): void };
  export function usePathname(): string;
}

declare module "next/cache" {
  export function revalidatePath(path: string): void;
  export function revalidateTag(tag: string): void;
  export function unstable_cache<T extends (...args: any[]) => any>(fn: T, keyParts?: string[], options?: any): T;
}

declare module "next/font/google" {
  export function Inter(opts: Record<string, unknown>): { className: string };
}

declare module "next/server" {
  export class NextResponse {
    static json(body: unknown, init?: Record<string, unknown>): unknown;
  }
}

declare module "next/link" {
  const Link: (props: Record<string, unknown>) => JSX.Element;
  export default Link;
}

declare module "next" {
  export type Metadata = Record<string, unknown>;
  export type NextConfig = Record<string, unknown>;
}

declare module "react" {
  export type ReactNode = unknown;
  export type ReactElement = unknown;
  export interface HTMLAttributes<T> extends Record<string, unknown> {}
  export interface ButtonHTMLAttributes<T> extends Record<string, unknown> {}
  export interface InputHTMLAttributes<T> extends Record<string, unknown> {}
  export interface LabelHTMLAttributes<T> extends Record<string, unknown> {}
  export interface SelectHTMLAttributes<T> extends Record<string, unknown> {}
  export function useTransition(): [boolean, (cb: () => void | Promise<void>) => void];
  export function useEffect(cb: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(cb: () => T, deps?: unknown[]): T;
  export function useState<T>(value: T): [T, (next: T | ((prev: T) => T)) => void];
  export function useActionState<S, P>(action: (state: S, payload: P) => S | Promise<S>, initialState: S): [S, (payload: P) => void, boolean];
  export const Fragment: unknown;
  export function forwardRef<T, P = Record<string, unknown>>(render: (props: P, ref: unknown) => JSX.Element): (props: P) => JSX.Element;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "@hookform/resolvers/zod" {
  export function zodResolver(schema: unknown): unknown;
}

declare module "react-hook-form" {
  export function useForm<T>(opts?: Record<string, unknown>): {
    register(name: keyof T & string): unknown;
    handleSubmit(fn: (values: T) => unknown): (e?: unknown) => unknown;
    reset(values?: Partial<T>): void;
    formState: Record<string, unknown>;
  };
}

declare module "next-themes" {
  export function ThemeProvider(props: Record<string, unknown>): unknown;
  export function useTheme(): { resolvedTheme?: string; setTheme(theme: string): void };
}

declare module "lucide-react" {
  export const Moon: any; export const Sun: any; export const Laptop: any; export const Menu: any; export const X: any;
  export const CreditCard: any; export const Wallet: any; export const LayoutDashboard: any; export const Settings: any;
  export const RefreshCcw: any; export const CalendarDays: any; export const Landmark: any; export const ArrowLeftRight: any;
  export const PiggyBank: any; export const Tags: any; export const Import: any; export const TrendingUp: any;
  export const Boxes: any; export const CircleDollarSign: any; export const FolderTree: any; export const PieChart: any;
  export const Repeat2: any; export const BarChart3: any; export const CalendarRange: any; export const DollarSign: any;
  export const Home: any; export const Repeat: any; export const CheckCircle2: any; export const DatabaseZap: any;
  export const FileSpreadsheet: any; export const ShieldAlert: any; export const Loader2: any; export const TriangleAlert: any;
  export const UploadCloud: any; export const ArrowDownRight: any; export const ArrowUpRight: any; export const ShieldCheck: any;
  export type LucideIcon = any;
}

declare module "recharts" {
  export const ResponsiveContainer: any; export const BarChart: any; export const Bar: any; export const XAxis: any; export const YAxis: any;
  export const CartesianGrid: any; export const Tooltip: any; export const Legend: any; export const LineChart: any; export const Line: any;
  export const AreaChart: any; export const Area: any; export const ReferenceLine: any;
}

declare module "better-sqlite3" { const Database: any; export default Database; }
declare module "drizzle-orm/better-sqlite3" { export function drizzle(sqlite: any, opts?: any): any; }

declare module "drizzle-orm/sqlite-core" {
  export function sqliteTable(name: string, cols: any, extra?: any): any;
  export function text(name: string): any;
  export function integer(name: string, opts?: any): any;
  export function real(name: string, opts?: any): any;
  export function index(name: string): any;
  export function uniqueIndex(name: string): any;
}

declare module "drizzle-orm" {
  export function eq(a: any, b: any): any;
  export function and(...a: any[]): any;
  export function or(...a: any[]): any;
  export function lt(a: any, b: any): any;
  export function lte(a: any, b: any): any;
  export function gt(a: any, b: any): any;
  export function gte(a: any, b: any): any;
  export function asc(a: any): any;
  export function desc(a: any): any;
  export function sql(strings: TemplateStringsArray, ...expr: any[]): any;
}

declare module "zod" {
  export const z: any;
  const _default: any;
  export default _default;
}

declare module "xlsx" { const x: any; export = x; }

declare module "date-fns" {
  export function addDays(d: any, n: any): any;
  export function addMonths(d: any, n: any): any;
  export function endOfMonth(d: any): any;
  export function format(d: any, f: any): string;
  export function parse(v: any, f: any, b: any): any;
  export function startOfMonth(d: any): any;
}

declare module "clsx" { const x: any; export default x; }
declare module "tailwind-merge" { export function twMerge(...v: any[]): string; }
declare module "class-variance-authority" { export function cva(...v: any[]): any; export type VariantProps<T> = any; }
declare module "tailwindcss" { const x: unknown; export default x; }

declare const Buffer: {
  from(value: string, encoding?: string): { buffer: ArrayBuffer; byteOffset: number; byteLength: number };
};
