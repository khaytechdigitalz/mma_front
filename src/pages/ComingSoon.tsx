import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function ComingSoon() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 24 * 12);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: Array<[string, number]> = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Minutes", time.minutes],
    ["Seconds", time.seconds],
  ];

  return (
    <div className="bg-primary-lighter/30 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <h1 className="text-gray-primary text-3xl font-extrabold md:text-5xl">
        We're launching something new
      </h1>
      <p className="text-gray-secondary max-w-md">
        We're working hard to bring you a brand new shopping experience. Leave
        your email and we'll notify you the moment we go live.
      </p>
      <div className="flex gap-3">
        {units.map(([label, value]) => (
          <div key={label} className="flex w-20 flex-col items-center rounded-xl bg-white py-3 shadow-regular">
            <span className="text-gray-primary text-xl font-bold">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-gray-tertiary text-xs">{label}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full max-w-md gap-2"
      >
        <input
          type="email"
          required
          placeholder="Your email address"
          className="h-12 w-full rounded-full border border-gray-300 bg-white px-4 text-sm focus:outline-0"
        />
        <Button type="submit" icon={<Send className="size-4" />}>
          Notify Me
        </Button>
      </form>
    </div>
  );
}
