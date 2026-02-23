
export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-600">CourseHub</span>
        <p className="text-xs text-zinc-600">
          &copy; 2026 CourseHub Inc. &mdash; Built with Django &amp; React
        </p>
      </div>
    </footer>
  );
}