'use client';

import * as React from 'react';
import Link from 'next/link';
import { allPosts } from 'content-collections';
import { format, isBefore } from 'date-fns';
import { ArrowRightIcon } from 'lucide-react';

import { baseUrl } from '@workspace/routes';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar';

import { GridSection } from '~/components/fragments/grid-section';
import { SiteHeading } from '~/components/fragments/site-heading';
import { getInitials } from '~/lib/formatters';

export function BlogPosts(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20 space-y-16">
        <SiteHeading
          badge="Blog Posts"
          title="Insights & News"
          description="Learn more from members of our team and industry-leading experts."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allPosts
            .slice()
            .sort((a, b) => (isBefore(a.published, b.published) ? 1 : -1))
            .map((post, index) => (
              <Link
                key={index}
                href={`${baseUrl.Marketing}${post.slug}`}
                className="flex h-full flex-col justify-between rounded-2xl bg-background p-6 shadow-xs transition-shadow hover:shadow-md dark:bg-accent/30 dark:hover:bg-accent/50"
              >
                <div className="mb-4 flex items-center justify-between text-muted-foreground text-sm">
                  <span>{post.category}</span>
                  <time dateTime={post.published}>
                    {format(post.published, 'dd MMM yyyy')}
                  </time>
                </div>

                <h2 className="mb-3 text-lg font-semibold md:text-xl">
                  {post.title}
                </h2>

                <p className="mb-4 text-muted-foreground line-clamp-3">
                  {post.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarImage
                        src={post.author?.avatar}
                        alt="avatar"
                      />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(post.author?.name ?? '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author?.name ?? ''}</span>
                  </div>
                  <div className="group flex items-center gap-2 text-sm hover:underline">
                    Read more
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </GridSection>
  );
}
