import { TypographyH1 } from "@/components/TypographyH1";
import { TypographyP } from "@/components/TypographyP";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import { ArrowDownIcon, GithubIcon, MoveRightIcon } from "lucide-react";
import NextLink from "next/link";
import { Fragment } from "react";
import { siteConfig } from "../config";

export default function Home() {
  return (
    <Fragment>
      <section className="flex flex-col items-center px-6 pt-16 text-center md:pt-24 lg:pt-32">
        <Button
          as={Link}
          isExternal
          href={siteConfig.github}
          variant="faded"
          radius="full"
          endContent={<GithubIcon />}
        >
          Star us on Github
        </Button>
        <TypographyH1 className="mt-6">{siteConfig.tagline}</TypographyH1>
        <TypographyP className="max-w-[75ch] text-sm md:text-base">
          {siteConfig.description}
        </TypographyP>
        <div className="w-full mt-6 flex flex-col flex-wrap items-center justify-center gap-4 lg:flex-row">
          <Button
            className="w-full lg:w-auto"
            as={Link}
            href="#features"
            variant="faded"
            endContent={<ArrowDownIcon size={20} />}
            size="lg"
            radius="sm"
          >
            Features
          </Button>
          <Button
            className="w-full font-semibold lg:w-auto"
            as={NextLink}
            href="/waitlist"
            color="primary"
            endContent={<MoveRightIcon size={20} />}
            size="lg"
            radius="sm"
          >
            Join Waitlist
          </Button>
        </div>
      </section>

      <section
        id="features"
        className="container mx-auto mt-24 px-6 md:mt-36 lg:mt-56"
      >
        <TypographyH1 className="mx-auto max-w-[18ch] text-center">
          A new era of productive students begins.
        </TypographyH1>
        <TypographyP className="mx-auto max-w-[60ch] text-center">
          Noodle is designed to keep you on top of your education, with powerful
          insights and automations, you&apos;ll never miss a thing again.
        </TypographyP>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-7 lg:grid-rows-2 lg:grid-areas-featuresWide"></div>
      </section>

      <section
        id="mission"
        className="mx-auto mt-36 flex max-w-screen-lg flex-col gap-8 px-6 lg:mt-56"
      >
        <TypographyH1 className="mx-auto max-w-[16ch] text-center">
          Discussing the elephant in the blender
        </TypographyH1>
        <TypographyP className="mx-auto leading-7 lg:max-w-[80ch]">
          You know that friend that you talk about the future with? <br />{" "}
          <br /> Well we&apos;re two friends, Ahmed and Sinclair that talk about
          the future. We came up with Noodle while talking about how great it
          would be to have a single platform that could make studies easier
          through cross compatibility. <br /> <br />
          You see we&apos;re not lazy, we just love when things work together
          properly. Noodle as you see it is the result of hours of discussions,
          hours of running ideas, talking with many fellow students. <br />{" "}
          <br /> We wanted a platform that could manage your notes in an easy to
          use way, give us information about where we are so we know where to
          go. Flash cards integrated with to do&apos;s, with calendars and so
          much more. What you see as Noodle is only&apos;the&apos;beginning.{" "}
          <br /> <br /> We say blender as that we see Noodle becoming a blend of
          everything that we needed while pursuing our degrees to keep on top of
          everything.
        </TypographyP>
      </section>
    </Fragment>
  );
}
