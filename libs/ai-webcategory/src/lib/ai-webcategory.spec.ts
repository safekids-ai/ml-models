import { AiWebCategory, LabelMap } from "./ai-webcategory";
import * as path from "path";
import * as ort from "onnxruntime-node";

let modelPath = path.resolve(__dirname, "../../../../model_files/webcategory");
let onnxFileName = "model.onnx";
modelPath = path.resolve(modelPath);

describe('web category model', () => {
  let originalArrayIsArray: typeof Array.isArray;

  beforeAll(() => {
    // Save the original Array.isArray implementation
    originalArrayIsArray = Array.isArray;

    // Mock Array.isArray to handle Float32Array and BigInt64Array
    (Array as any).isArray = (type: any): type is any[] => {
      if (type?.constructor?.name === "Float32Array" || type?.constructor?.name === "BigInt64Array") {
        return true;
      }
      return originalArrayIsArray(type);
    };
  });

  afterAll(() => {
    // Restore the original Array.isArray implementation
    Array.isArray = originalArrayIsArray;
  });

  it("test simple", async () => {
    const model = new AiWebCategory(modelPath, onnxFileName);
    await model.initialize();
    const result = await model.classify("Productos destacados\\nInformación\\nProductos\\nSex Shop Mayorista en Santiago de Chile  VENTA Por Mayor de juguetes Eroticos\\nperson Quienes Somos    shopping_cart Cómo comprar    place Visítanos    library_books Blog     help FAQ    brightness_low Certificados    mail_outline Contáctanos\\nAtencion a Clientes 0226718683\\n569 7974 9341\\nSolo Mensajes\\n569 4040 6009 Atención tienda");
    console.log(result); // Optionally log the result for debugging
  });
});
