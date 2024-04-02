import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="contentWrapper">
      <div className="pt-[10rem]">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-[44px]">Not Found</h2>
          <h2 className="text-[24px] mt-5 mb-5 p-2">
            Could not find requested resource
          </h2>
          <Link
            href="/"
            className="text-[24px] underline text-red-400 hover:cursor-pointer m-0 p-0"
          >
            Return Home
          </Link>
        </div>
      </div>
      <section id="session-content-how-it-works-privacy5">
        <div className="row"></div>
      </section>
    </div>
  );
}
