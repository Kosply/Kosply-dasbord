import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

/**
 * @title StateContainer
 * @notice Small switchboard that renders exactly one of loading / error /
 * @notice empty / content, so every data surface handles the three non-happy
 * @notice states the same way.
 * @dev Directive-free: it inherits Server or Client context from its importer.
 * @dev Priority order is loading → error → empty → children.
 */

/**
 * @notice Chooses the state block to render.
 * @param {object} props Component properties.
 * @param {boolean} props.isLoading True while the data is in flight.
 * @param {Error | string | null} [props.error=null] Error from the data layer.
 * @param {boolean} [props.isEmpty=false] True when the response carried zero rows.
 * @param {() => void} [props.onRetry] Retry handler forwarded to `ErrorState`.
 * @param {import('react').ReactNode} props.children Content rendered when no state is active.
 * @param {import('react').ReactNode} [props.loadingComponent] Custom loading override.
 * @param {import('react').ReactNode} [props.errorComponent] Custom error override.
 * @param {import('react').ReactNode} [props.emptyComponent] Custom empty override.
 * @param {object} [props.stateProps] Extra props for the default state components.
 * @param {object} [props.stateProps.loading] Props for `LoadingState`.
 * @param {object} [props.stateProps.error] Props for `ErrorState`.
 * @param {object} [props.stateProps.empty] Props for `EmptyState`.
 * @returns {JSX.Element} The active state block or the content.
 */
export default function StateContainer({
  isLoading,
  error = null,
  isEmpty = false,
  onRetry,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  stateProps = {},
}) {
  if (isLoading) {
    return loadingComponent ?? <LoadingState {...(stateProps.loading || {})} />;
  }

  if (error) {
    return (
      errorComponent ?? <ErrorState error={error} onRetry={onRetry} {...(stateProps.error || {})} />
    );
  }

  if (isEmpty) {
    return emptyComponent ?? <EmptyState {...(stateProps.empty || {})} />;
  }

  return <>{children}</>;
}
