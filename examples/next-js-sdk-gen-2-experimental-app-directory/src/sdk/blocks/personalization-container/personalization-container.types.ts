import type { BuilderBlock } from '../../types/builder-block';
import type { BuilderDataProps } from '../../types/builder-props';
import type { Query } from './helpers';
export type PersonalizationContainerProps = {
  children?: any;
  attributes?: any;
  previewingIndex?: number | null;
  variants?: Array<{
    blocks: BuilderBlock[];
    query: Query[];
    startDate?: string;
    endDate?: string;
  }>;
} & BuilderDataProps;
