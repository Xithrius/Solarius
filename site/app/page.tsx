"use client";

import { title, subtitle } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Card, CardBody, Divider, Skeleton } from "@nextui-org/react";
import { nextapi } from "@/config/api";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useTheme } from "next-themes";

const LightStyledCard = styled(Card)`
  border-radius: 12px;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(90deg, #ed6e61, #6359e1) border-box;
  border: 3px solid transparent;
`;

const DarkStyledCard = styled(Card)`
  border-radius: 12px;
  background:
    linear-gradient(#303133, #303133) padding-box,
    linear-gradient(90deg, #ed6e61, #6359e1) border-box;
  border: 3px solid transparent;
`;

export default function Home() {
  const [searchOutput, setSearchOutput] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  const StyledCard = theme.theme === "light" ? LightStyledCard : DarkStyledCard;

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { search: "" },
  });

  const onSubmit = async (data: any) => {
    setSearchOutput(undefined);

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

    const CardOutput = () => {
      if (searchOutput) {
        return (
          <StyledCard
            className="w-full md:w-[640px] mx-auto space-y-5 p-4"
            radius="lg"
          >
            <CardBody>
              <p>{searchOutput}</p>
            </CardBody>
          </StyledCard>
        );
      } else if (isLoading) {
        return (
          <Card
            className="w-full md:w-[640px] mx-auto space-y-5 p-4"
            radius="lg"
          >
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        );
      }

      return null;
    };

    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        {searchOutput || isLoading ? (
          <>
            <div className={subtitle()}>Summary</div>
            <Divider className="my-4 w-full md:w-[640px] mx-auto" />
          </>
        ) : undefined}
        <CardOutput />
      </motion.div>
    );
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
                  control._reset();
                  setSearchOutput(undefined);
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
                    "w-full",
                    "md:w-[640px]",
                    "mx-auto",
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
