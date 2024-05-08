/* eslint-disable @next/next/no-img-element */
/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */

import React from "react";

export type RecentVisitsProps = {
  Ip: string;
  referenceId: string;
  AttackType: string;
};

export default function RecentVisitsCard(props: RecentVisitsProps) {
  return (
    <div className="  flex flex-wrap justify-between gap-3 ">
      <section className="flex justify-between gap-3 ">
        <div className=" h-12 w-12 rounded-full bg-gray-100 p-1">
          <img width={200} height={200} src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${props.Ip}`} alt="avatar" />
        </div>
        <div className="text-sm">
            <p>{props.Ip}</p>
            <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400">
                {props.referenceId}
            </div>
        </div>
      </section>
        <p>{props.AttackType}</p>
    </div>
  );
}
