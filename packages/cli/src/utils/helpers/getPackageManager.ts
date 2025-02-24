import { detect } from "@antfu/ni"

export const getPackageManager = async (targetDir: string) => {
    const packageManager = await detect({ programmatic: true, cwd: targetDir })

    if (packageManager === "yarn@berry") return "yarn"
    if (packageManager === "pnpm@6") return "pnpm"
    if (packageManager === "bun") return "bun"
    if (packageManager === "deno") return "deno"

    return packageManager ?? "npm"
}