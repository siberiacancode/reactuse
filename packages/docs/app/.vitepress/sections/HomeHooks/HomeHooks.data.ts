import { getContent } from '../../../../src/utils';

export default {
  async load() {
    const hooks = await getContent('hook');

    return {
      hooks
    };
  }
};
