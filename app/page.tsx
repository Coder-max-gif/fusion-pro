import { BotDialogProvider } from "@/components/BotDialog";
import { Bots } from "@/components/BotsSection";
import { ChapterHUD } from "@/components/ChapterHUD";
import { Compare } from "@/components/Compare";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Minds } from "@/components/Minds";
import { Nav } from "@/components/Nav";
import { Risk } from "@/components/Risk";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Story } from "@/components/Story";
import { Technology } from "@/components/Technology";
import { World } from "@/components/world/World";

export default function Home() {
  return (
    <BotDialogProvider>
      <SmoothScroll />
      <World />
      <Nav />
      <ChapterHUD />
      <main id="main">
        <Hero />
        <Story />
        <Minds />
        <Bots />
        <Compare />
        <HowItWorks />
        <Technology />
        <Risk />
        <FAQ />
      </main>
      <Footer />
    </BotDialogProvider>
  );
}
