import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import gsap from "gsap";

import { useUiContext } from "../../hooks/useUiContext";
import useIsMobile from "../../hooks/useIsMobile";
import NavBar from "./component/NavBar";
import SideBar from "./component/SideBar";
import Footer from "./component/Footer";

const SIDEBAR_WIDTH = 256;

const Home = () => {
  const { menuIsOpen, setMenuIsOpen } = useUiContext();
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, []);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const main = mainRef.current;
    const backdrop = backdropRef.current;
    if (!sidebar || !main) return;

    if (isMobile) {
      if (menuIsOpen) {
        gsap.to(sidebar, { x: 0, duration: 0.35, ease: "power2.out" });
        if (backdrop)
          gsap.to(backdrop, {
            opacity: 1,
            duration: 0.3,
            pointerEvents: "auto",
          });
      } else {
        gsap.to(sidebar, { x: "-100%", duration: 0.3, ease: "power2.in" });
        if (backdrop)
          gsap.to(backdrop, {
            opacity: 0,
            duration: 0.25,
            pointerEvents: "none",
          });
      }

      gsap.set(main, { clearProps: "marginLeft" });
    } else {
      if (backdrop) gsap.set(backdrop, { opacity: 0, pointerEvents: "none" });
      if (menuIsOpen) {
        gsap.to(sidebar, { x: 0, duration: 0.35, ease: "power2.out" });
        gsap.to(main, {
          marginLeft: SIDEBAR_WIDTH,
          duration: 0.35,
          ease: "power2.out",
        });
      } else {
        gsap.to(sidebar, {
          x: -SIDEBAR_WIDTH,
          duration: 0.3,
          ease: "power2.in",
        });
        gsap.to(main, { marginLeft: 0, duration: 0.3, ease: "power2.in" });
      }
    }
  }, [menuIsOpen, isMobile]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0A0F1C] flex flex-col overflow-x-hidden"
    >
      <NavBar />

      <div
        ref={backdropRef}
        onClick={() => setMenuIsOpen(false)}
        style={{ pointerEvents: "none" }}
        className="fixed inset-0 bg-black/60 z-30 opacity-0"
      />

      <div className="flex flex-1 relative mt-16">
        <aside
          ref={sidebarRef}
          style={{ transform: "translateX(-100%)" }}
          className="fixed top-0 left-0 z-40 border-r border-white/5
                     w-full md:w-64
                     h-dvh md:h-[calc(100dvh-4rem)] md:top-16
                     bg-[#0A0F1C]"
        >
          <SideBar />
        </aside>

        <div
          ref={mainRef}
          className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] w-full"
        >
          <main className="flex-1 px-4 md:px-6 py-6 text-white">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
