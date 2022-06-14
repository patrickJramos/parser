"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myFunction = void 0;
const typescript_1 = __importStar(require("typescript"));
function createParameter(name, type, dotDotDot) {
    return typescript_1.default.factory.createTypeParameterDeclaration(undefined, name, undefined, type);
}
function createPrimitiveType(type) {
    switch (type) {
        case 'string':
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword);
        case 'number':
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword);
        case 'boolean':
            return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.BooleanKeyword);
        default:
            throw new Error(`Unknown primitive type: ${type}`);
    }
}
function createFunction(name, params) {
    const fn = typescript_1.default.factory.createFunctionDeclaration(undefined, undefined, undefined, name, params.map(p => createParameter(p.name, createPrimitiveType(p.type))), [], createPrimitiveType('string'), typescript_1.default.factory.createBlock([]));
    return fn;
}
function myFunction() {
    // const abc = createFunction('myFunction', []);
    // console.log(abc);
    const variableStatement = typescript_1.default.factory.createVariableStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([
        typescript_1.default.factory.createVariableDeclaration("a", undefined, undefined, typescript_1.default.factory.createNumericLiteral("123")),
    ], typescript_1.default.NodeFlags.Const));
    const file = typescript_1.default.factory.createSourceFile([variableStatement], typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EndOfFileToken), typescript_1.default.NodeFlags.Const);
    // const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const res = file.statements.map(s => {
        return render(s);
    });
    return res;
}
exports.myFunction = myFunction;
const aaaa = myFunction();
// run after document body is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log(document.body);
    const div = document.createElement('div');
    div.innerHTML = aaaa[0][0];
    document.body.appendChild(div);
});
function render(statement, file) {
    if (typescript_1.default.isVariableStatement(statement)) {
        const res = renderVariableStatement(statement);
        return res;
    }
}
function renderVariableStatement(statement, file) {
    function getName(varDec) {
        try {
            return varDec.name.getText(file);
        }
        catch (_a) {
            return varDec.name.escapedText;
        }
    }
    function getInitializer(varDec) {
        var _a;
        try {
            return (_a = varDec.initializer) === null || _a === void 0 ? void 0 : _a.getText(file);
        }
        catch (_b) {
            return varDec.initializer.text;
        }
    }
    const decList = statement.declarationList;
    console.log(decList.flags, typescript_1.NodeFlags.Const);
    const isConst = (decList.flags & typescript_1.NodeFlags.Const) === typescript_1.NodeFlags.Const;
    const resultList = statement.declarationList.declarations.map(d => {
        const initializer = getInitializer(d);
        const result = `
      <div class='node var-declaration ${isConst ? 'const' : ''}'>
        <div class='var-name'>${getName(d)}</div>
        ${initializer && `<div class='var-initializer'>${initializer}</div>`}
      </div>
      `;
        return result;
    });
    return resultList;
}
