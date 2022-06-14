import ts, { NodeFlags, Statement, VariableDeclaration, VariableStatement } from 'typescript';

function createParameter(name: string, type: ts.TypeNode, dotDotDot?: boolean) {
  return ts.factory.createTypeParameterDeclaration(
    undefined,
    name,
    undefined, 
    type
);
}

function createPrimitiveType<t extends 'string' | 'number' | 'boolean'>(type: t) {
  switch (type) {
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'number':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case 'boolean':
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    default:
        throw new Error(`Unknown primitive type: ${type}`);
  }
}

type primitiveType = 'string' | 'number' | 'boolean';

type param = {
  name: string,
  type: primitiveType,
}

function createFunction(name: string, params: param[]) {

  const fn = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    undefined,
    name,
    params.map(p => createParameter(p.name, createPrimitiveType(p.type))),
    [],
    createPrimitiveType('string'),
    ts.factory.createBlock([]));

    return fn;
}

export function myFunction() {

  // const abc = createFunction('myFunction', []);
  // console.log(abc);

  

  const variableStatement = ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          "a",
          undefined,
          undefined,
          ts.factory.createNumericLiteral("123")
        ),
      ],
      ts.NodeFlags.Const
    )
  );

  const file = ts.factory.createSourceFile([variableStatement], ts.factory.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.Const);
  
  // const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const res = file.statements.map(s => {
    return render(s);
  });

  return res;
}



const aaaa = myFunction();

// run after document body is loaded
document.addEventListener('DOMContentLoaded', () => {

  console.log(document.body);
  
  const div = document.createElement('div');
  div.innerHTML = aaaa[0]![0];
  document.body.appendChild(div);
});



function render(statement: Statement, file? : ts.SourceFile) {


  if (ts.isVariableStatement(statement)) {
    const res = renderVariableStatement(statement);
    return res;
  }

}

function renderVariableStatement(statement: VariableStatement, file?: ts.SourceFile) {
  function getName(varDec: VariableDeclaration): string {
    try {
      return varDec.name.getText(file);
    } catch {
      return (varDec.name as any).escapedText;
    }
  }

  function getInitializer(varDec: VariableDeclaration): string | undefined {
    try {
      return varDec.initializer?.getText(file);
    } catch {
      return (varDec.initializer as any).text;
    }
  }
  const decList = statement.declarationList;

    console.log(decList.flags, NodeFlags.Const )

    const isConst = (decList.flags & NodeFlags.Const) === NodeFlags.Const;

    const resultList = statement.declarationList.declarations.map(d => {
      const initializer = getInitializer(d);
      
      const result = `
      <div class='node var-declaration ${isConst ? 'const' : ''}'>
        <div class='var-name'>${getName(d)}</div>
        ${initializer && `<div class='var-initializer'>${initializer}</div>`}
      </div>
      `;

      return result;
    })

    return resultList;
}
