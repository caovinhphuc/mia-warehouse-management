import React, { Suspense } from 'react';
import ModuleErrorBoundary from './ErrorBoundary';
import { LoadingSpinner } from './SharedComponentsApp';

// Higher-order component để wrap lazy-loaded modules với error boundary và suspense
const withModuleWrapper = (LazyComponent, moduleName) => {
  const WrappedComponent = (props) => (
    <ModuleErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Đang tải {moduleName}...
              </p>
            </div>
          </div>
        }
      >
        <LazyComponent {...props} />
      </Suspense>
    </ModuleErrorBoundary>
  );

  WrappedComponent.displayName = `withModuleWrapper(${moduleName})`;
  return WrappedComponent;
};

export default withModuleWrapper;
