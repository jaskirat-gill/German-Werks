import { ArrrowRight } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"


const Hero = async () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={'https://i.imgur.com/8DAUk2r.mp4'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6 bg-black bg-opacity-50">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-white font-normal"
            >
            German Werks
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-white font-normal"
            >
            By Car Enthusiasts, For Car Enthusiasts
          </Heading>
        </span>
        <LocalizedClientLink href={`/store`}>
          <Button variant="secondary">
            Shop Now
            <ArrrowRight />
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
