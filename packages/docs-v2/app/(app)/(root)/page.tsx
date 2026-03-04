import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Icons } from "@/components/icons"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

const description =
  "Improve your react applications with our library 📦 designed for comfort and speed"

export const dynamic = "force-static"
export const revalidate = false

const cardsData = [
  {
    title: "Lightweight & Scalable",
    details:
      "Hooks are lightweight and easy to use, making it simple to integrate into any project.",
    icon: Icons.expandArrows,
  },
  {
    title: "Clean & consistent",
    details:
      "Hooks follow a unified approach for consistency and maintainability.",
    icon: Icons.aperture,
  },
  {
    title: "Customizable",
    details: "Install and customize hooks effortlessly using our CLI",
    icon: Icons.palette,
  },
  {
    title: "Large collection",
    details:
      "Extensive collection of hooks for all your needs, from state management to browser APIs.",
    icon: Icons.box,
  },
  {
    title: "Tree shakable",
    details:
      "The hooks are tree shakable, so you only import the hooks you need in your application.",
    icon: Icons.tree,
  },
  {
    title: "Active community",
    details:
      "Join our active community on Github and help make reactuse even better.",
    icon: Icons.users,
  },
]

const title = "reactuse"

export const metadata: Metadata = {
  title,
}

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <PageHeaderHeading className="max-w-4xl">
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-6xl font-bold text-transparent">
            reactuse
          </span>
          &nbsp; the largest and most useful hook library
        </PageHeaderHeading>
        <PageHeaderDescription>
          Improve your react applications with our library 📦 designed for
          comfort and speed
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm" className="h-[31px] rounded-lg">
            <Link href="/docs/installation">Get Started</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="rounded-lg">
            <Link href="/docs/hooks">View hooks</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {cardsData.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-card space-y-3 rounded-xl border p-6 py-10"
            >
              <div className="bg-accent flex h-8 w-8 items-center justify-center rounded border">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-sm text-gray-400">{card.details}</p>
            </div>
          )
        })}
      </div>
      <div className="mt-20">
        <div className="mb-10 text-center text-4xl font-bold">
          Team & Contributors
        </div>
        <div className="flex items-center justify-center">
          <Link href="https://github.com/siberiacancode">
            <div className="flex items-center justify-center gap-3">
              <Image
                width={40}
                height={40}
                alt="SIBERIA CAN CODE"
                className="rounded-lg"
                src="https://avatars.githubusercontent.com/u/122668137?s=200&v=4"
              />
              <div className="text-xl font-bold">SIBERIA CAN CODE</div>
            </div>
          </Link>
        </div>
        <div className="mt-12 text-center"></div>
      </div>
    </div>
  )
}
