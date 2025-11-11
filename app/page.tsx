import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ValueProps from '@/components/ValueProps'
import ProblemSection from '@/components/ProblemSection'
import HowItWorks from '@/components/HowItWorks'
import Benefits from '@/components/Benefits'
import PlansCTA from '@/components/PlansCTA'
import Testimonials from '@/components/Testimonials'
import About from '@/components/About'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProblemSection />
      <ValueProps />
      <HowItWorks />
      <Benefits />
      <PlansCTA />
      <Testimonials />
      <About />
      <FinalCTA />
      <Footer />
    </main>
  )
}

