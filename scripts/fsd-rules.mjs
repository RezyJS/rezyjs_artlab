import path from 'node:path';
const layers = { shared: 0, entities: 1, features: 2, widgets: 3, app: 4 };
const plugin = {
  rules: {
    boundaries: {
      meta: { type: 'problem', schema: [], messages: { upward: 'FSD imports must point to a lower layer.', sibling: 'FSD slices on the same layer must remain independent.', api: 'Import another slice through its public index.ts API.' } },
      create(context) {
        const current = path.relative(process.cwd(), context.filename).replaceAll('\\', '/').split('/');
        if (!(current[0] in layers)) return {};
        const check = node => {
          const source = node.source?.value;
          if (typeof source !== 'string') return;
          const target = source.startsWith('@/') ? source.slice(2) : source.startsWith('.') ? path.posix.normalize(path.posix.join(current.slice(0, -1).join('/'), source)) : null;
          if (!target) return;
          const parts = target.split('/');
          if (!(parts[0] in layers)) return;
          if (layers[parts[0]] > layers[current[0]]) context.report({ node, messageId: 'upward' });
          else if (parts[0] === current[0] && parts[0] !== 'shared' && parts[0] !== 'app' && parts[1] !== current[1]) context.report({ node, messageId: 'sibling' });
          else if (parts[0] !== 'shared' && parts[0] !== 'app' && (parts[0] !== current[0] || parts[1] !== current[1]) && parts.length > 2 && !/^index(\.ts)?$/.test(parts[2])) context.report({ node, messageId: 'api' });
        };
        return { ImportDeclaration: check, ImportExpression: check, ExportNamedDeclaration: check, ExportAllDeclaration: check };
      },
    },
  },
};
export default plugin;
