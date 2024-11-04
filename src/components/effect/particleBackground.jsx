import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Đảm bảo bạn đã cài đặt "tsparticles-slim"

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadSlim(engine); // Tải slim version của tsparticles
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 120,
        interactivity: {
          events: {
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff", // Màu của particles
          },
          links: {
            color: "#ffffff", // Màu của các liên kết giữa các particles
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5, // Độ trong suốt của particles
          },
          shape: {
            type: "circle", // Hình dạng particles
          },
          size: {
            value: { min: 1, max: 5 }, // Kích thước particles
          },
        },
        detectRetina: true, // Tự động điều chỉnh cho retina
      }}
    />
  );
}
