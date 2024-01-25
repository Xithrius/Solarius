"use client";

import { title, subtitle } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Card, CardBody, CircularProgress } from "@nextui-org/react";
import { nextapi } from "@/config/api";
import { motion } from "framer-motion";

export default function Home() {
  const [searchOutput, setSearchOutput] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: { search: "" },
  });

  const onSubmit = async (data: any) => {
    const { search } = data;

    if (!search) {
      return;
    }

    setIsLoading(true);

    const res = await nextapi.get(`/api/search?query=${search}`);

    setIsLoading(false);

    if (res.status == 200) {
      const data = res.data;
      setSearchOutput(data.data.output);
    }
  };

  const SearchedOutput = () => {
    const cardVariants = {
      hidden: { opacity: 0, y: 25 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    };

    if (searchOutput) {
      return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardBody>
              <p>Summary: {searchOutput}</p>
            </CardBody>
          </Card>
        </motion.div>
      );
    } else if (isLoading) {
      return <CircularProgress aria-label="Loading..." />;
    }

    return null;
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className={title()}>Solarius</div>
      <div className="mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="GET"
          className="flex flex-col items-center"
        >
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                label="Search"
                isClearable
                onClear={() => {
                  field.value = "";
                }}
                radius="lg"
                classNames={{
                  label: "text-black/50 dark:text-white/90",
                  input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "shadow-lg",
                    "w-full", // Use 100% width on small screens
                    "md:w-[640px]", // Use 640px width on medium screens and up
                    "mx-auto", // Center the input field
                  ],
                }}
                placeholder="Type to search..."
                startContent={
                  <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
                {...field}
              />
            )}
          />
          <Button
            type="submit"
            radius="full"
            className="mt-6 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg justify-center items-center w-60"
          >
            Search
          </Button>
        </form>
      </div>
      <div>
        <SearchedOutput />
      </div>
    </section>
  );
}
