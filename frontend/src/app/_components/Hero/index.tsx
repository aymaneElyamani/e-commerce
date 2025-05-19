'use client'

import React, { useEffect, useState } from "react"
import HeroCarousel from "./HeroCarousel"
import HeroFeature from "./HeroFeature"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const Hero = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/offers/`)
        setOffers(response.data)
      } catch (error) {
        toast.error(`Error fetching offers: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return (
      <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-2  bg-[#E5EAF4]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap gap-5">
            <div className="xl:max-w-[757px] w-full">
              <Skeleton className="w-full h-[400px] rounded-[10px]" />
            </div>

            <div className="xl:max-w-[393px] w-full flex flex-col gap-5">
              <Skeleton className="w-full h-[200px] rounded-[10px]" />
              <Skeleton className="w-full h-[200px] rounded-[10px]" />
            </div>
          </div>
        </div>
        <div className="mt-10 max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="h-[120px] w-full rounded-md" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-2 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />
              <HeroCarousel offers={offers} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {/* Card 1 */}
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <a href="#"> iPhone 14 Plus & 14 Pro Max </a>
                    </h2>
                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">$699</span>
                        <span className="font-medium text-2xl text-dark-4 line-through">$999</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <Image
                      src="/images/hero/hero-02.png"
                      alt="mobile image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <a href="#"> Wireless Headphone </a>
                    </h2>
                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">$699</span>
                        <span className="font-medium text-2xl text-dark-4 line-through">$999</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <Image
                      src="/images/hero/hero-01.png"
                      alt="mobile image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero features */}
      <HeroFeature />
    </section>
  )
}

export default Hero
