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
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Make&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
        <br />
        <h1 className={title()}>
          websites regardless of your design experience.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </h2>
      </div>

      <div className="mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="GET"
          className="flex flex-col"
        >
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                label="Search"
                isClearable
                // TODO: Fix clearing, this does not work.
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
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
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
            className="mt-4 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg justify-center items-center mx-16"
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
