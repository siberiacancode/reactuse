import ts from 'typescript';

export const extractTypeInfo = (sourceFile: ts.SourceFile) => {
  const typeDeclarations: string[] = [];
  const typeImports: string[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      typeDeclarations.push(node.getText(sourceFile));
    }

    if (ts.isImportDeclaration(node)) {
      const isTypeOnly = node.importClause?.isTypeOnly;
      const hasTypeImports =
        node.importClause?.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings) &&
        node.importClause.namedBindings.elements.some((element) => element.isTypeOnly);

      if (isTypeOnly || hasTypeImports) {
        typeImports.push(node.getText(sourceFile));
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return [...typeImports, ...typeDeclarations].join('\n\n');
};
