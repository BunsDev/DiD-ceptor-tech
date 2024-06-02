import React from "react";
import Link from "next/link";
import Button from "../Button";

const Image: React.FC<ImageProps> = ({ src, alt }) => {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="aspect-square fill-white w-[22px] hover:w-[20px] duration-300 ease-in-out cursor-pointer absolute top-[2%] right-[5%] md:right-[3%] lg:right-[2%]"
    />
  );
};

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const Img: React.FC<ImageProps> = ({ src, alt, className = "" }) => (
  <img loading="lazy" src={src} alt={alt} className={`object-cover block mx-auto size-52 ${className}`} />
);

const ModalRequestJoin: React.FC = () => (
  <main
    className="fixed left-[4%] top-[4%] flex items-center 
    justify-center px-20 py-10 bg-neutral-900 w-11/12 h-[93%] flex-col rounded-lg
    "
  >
    <Link href="/">
      <Image
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/aaef4e2a9237795f9216834b65e66dc45dcb3c95123550f6095918e739a59f70?apiKey=f105a41ce1294bd5b1f98d323241cf27&"
        alt="Decorative square shape in white"
      />
    </Link>
    <Img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ec6970fc0b6fad2272e7c89412b25ecd7aa2d28914bda2242d5b273fab7c9eb?apiKey=f105a41ce1294bd5b1f98d323241cf27&"
      alt="Descriptive alt text here"
    />
    <div
      className="flex flex-col items-center 
      text-center"
    >
      <h1 className="mt-4 text-5xl text-white leading-[76.8px] max-md:max-w-full max-md:text-4xl">
        Your Request Has Been Sent.
      </h1>
      <p className="self-stretch mt-7 text-lg leading-7 text-gray-200 max-md:max-w-full">
        Your request to join has been sent to Admin Dashboard. They will review the information and contact you through
        email to confirm your request.
      </p>
      <Link href="/">
        <Button variant="fill" className="md:w-[574px] w-[300px]">
          Back to Home
        </Button>
      </Link>
    </div>
  </main>
);

export default ModalRequestJoin;
