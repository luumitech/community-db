import { authMiddleware } from './middlewares/auth';
import { chain } from './middlewares/chain';

/** Middle wares are executed in order until it returns a response */
export default chain([
  // Verify authentication
  authMiddleware,
]);
