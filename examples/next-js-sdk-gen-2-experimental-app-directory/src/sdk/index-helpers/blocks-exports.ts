export { default as Button } from '../blocks/button/button';
export { default as Columns } from '../blocks/columns/columns';
export { default as Fragment } from '../blocks/fragment/fragment';
export { default as Image } from '../blocks/image/image';
export { default as Section } from '../blocks/section/section';
export { default as Symbol } from '../blocks/symbol/symbol';
export { default as Text } from '../blocks/text/text';
export { default as Video } from '../blocks/video/video';
export { Blocks, Content };
import { default as Blocks } from '../components/blocks/blocks';
import { default as Content } from '../components/content-variants/content-variants';

/**
 * @deprecated Renamed to `Blocks`.
 */
export const RenderBlocks = Blocks;
/**
 * @deprecated Renamed to `Content`.
 */
export const RenderContent = Content;
