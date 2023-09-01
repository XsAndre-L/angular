/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import type {DependencyType} from './definition';

/**
 * Describes the shape of a function generated by the compiler
 * to download dependencies that can be defer-loaded.
 */
export type DependencyResolverFn = () => Array<Promise<DependencyType>>;

/**
 * Describes the state of defer block dependency loading.
 */
export enum DeferDependenciesLoadingState {
  /** Initial state, dependency loading is not yet triggered */
  NOT_STARTED,

  /** Dependency loading was scheduled (e.g. `on idle`), but has not started yet */
  SCHEDULED,

  /** Dependency loading is in progress */
  IN_PROGRESS,

  /** Dependency loading has completed successfully */
  COMPLETE,

  /** Dependency loading has failed */
  FAILED,
}

/** Configuration object for a `{:loading}` block as it is stored in the component constants. */
export type DeferredLoadingBlockConfig = [minimumTime: number|null, afterTime: number|null];

/** Configuration object for a `{:placeholder}` block as it is stored in the component constants. */
export type DeferredPlaceholderBlockConfig = [afterTime: number|null];

/**
 * Describes the data shared across all instances of a {#defer} block.
 */
export interface TDeferBlockDetails {
  /**
   * Index in an LView and TData arrays where a template for the primary content
   * can be found.
   */
  primaryTmplIndex: number;

  /**
   * Index in an LView and TData arrays where a template for the `{:loading}`
   * block can be found.
   */
  loadingTmplIndex: number|null;

  /**
   * Extra configuration parameters (such as `after` and `minimum`)
   * for the `{:loading}` block.
   */
  loadingBlockConfig: DeferredLoadingBlockConfig|null;

  /**
   * Index in an LView and TData arrays where a template for the `{:placeholder}`
   * block can be found.
   */
  placeholderTmplIndex: number|null;

  /**
   * Extra configuration parameters (such as `after` and `minimum`)
   * for the `{:placeholder}` block.
   */
  placeholderBlockConfig: DeferredPlaceholderBlockConfig|null;

  /**
   * Index in an LView and TData arrays where a template for the `{:error}`
   * block can be found.
   */
  errorTmplIndex: number|null;

  /**
   * Compiler-generated function that loads all dependencies for a `{#defer}` block.
   */
  dependencyResolverFn: DependencyResolverFn|null;

  /**
   * Keeps track of the current loading state of defer block dependencies.
   */
  loadingState: DeferDependenciesLoadingState;

  /**
   * Dependency loading Promise. This Promise is helpful for cases when there
   * are multiple instances of a defer block (e.g. if it was used inside of an *ngFor),
   * which all await the same set of dependencies.
   */
  loadingPromise: Promise<unknown>|null;
}

/**
 * Describes the current state of this {#defer} block instance.
 *
 * @publicApi
 * @developerPreview
 */
export enum DeferBlockState {
  /** The {:placeholder} block content is rendered */
  Placeholder = 0,

  /** The {:loading} block content is rendered */
  Loading = 1,

  /** The main content block content is rendered */
  Complete = 2,

  /** The {:error} block content is rendered */
  Error = 3,
}

/**
 * Describes the initial state of this {#defer} block instance.
 *
 * Note: this state is internal only and *must* be represented
 * with a number lower than any value in the `DeferBlockState` enum.
 */
export enum DeferBlockInternalState {
  /** Initial state. Nothing is rendered yet. */
  Initial = -1,
}

/**
 * A slot in the `LDeferBlockDetails` array that contains a number
 * that represent a current block state that is being rendered.
 */
export const DEFER_BLOCK_STATE = 0;

/**
 * Describes instance-specific {#defer} block data.
 *
 * Note: currently there is only the `state` slot, but more slots
 * would be added later to keep track of `after` and `maximum` features
 * (which would require per-instance state).
 */
export interface LDeferBlockDetails extends Array<unknown> {
  [DEFER_BLOCK_STATE]: DeferBlockState|DeferBlockInternalState;
}

/**
 * Internal structure used for configuration of defer block behavior.
 * */
export interface DeferBlockConfig {
  behavior: DeferBlockBehavior;
}

/**
 * Options for configuring defer blocks behavior.
 * @publicApi
 * @developerPreview
 */
export enum DeferBlockBehavior {
  /**
   * Manual triggering mode for defer blocks. Provides control over when defer blocks render
   * and which state they render. This is the default behavior in test environments.
   */
  Manual,

  /**
   * Playthrough mode for defer blocks. This mode behaves like defer blocks would in a browser.
   */
  Playthrough,
}
