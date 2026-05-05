import { createWorker } from "tesseract.js";

async function convertToBlackAndWhite(
	imageSrc: string,
	threshold: number = 127,
) {
	const image = new Image();
	image.src = imageSrc;
	await new Promise<void>((resolve, reject) => {
		image.onload = () => resolve();
		image.onerror = () => reject(new Error("Failed to load captcha image"));
	});

	const canvas = document.createElement("canvas");
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;

	const context = canvas.getContext("2d");
	if (!context) {
		throw new Error("Failed to create canvas context");
	}

	context.imageSmoothingEnabled = false;
	context.drawImage(image, 0, 0);

	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const { data } = imageData;

	for (let index = 0; index < data.length; index += 4) {
		const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
		const value = brightness > threshold ? 255 : 0;

		data[index] = value;
		data[index + 1] = value;
		data[index + 2] = value;
	}

	context.putImageData(imageData, 0, 0);
	return canvas.toDataURL("image/png");
}

async function ocr(imageSrc: string, length?: number) {
	try {
		const worker = await createWorker("eng");
		let {
			data: { text, confidence },
		} = await worker.recognize(imageSrc);
		await worker.terminate();

		if (confidence < 50) {
			console.warn(
				`Low OCR confidence (${confidence}%) for captcha. Detected text: "${text.trim()}"`,
			);
			return "";
		}

		text = text.replace(/\s/g, ""); // Remove all whitespace

		if (length && text.length !== length) {
			return "";
		}

		return text;
	} catch (error) {
		console.error("Error during OCR processing:", error);
		return "";
	}
}

export async function solveCaptcha(
	image: string,
	length?: number,
): Promise<string> {
	try {
		image = await convertToBlackAndWhite(image);
		const text = await ocr(image, length);
		return text;
	} catch {
		return "";
	}
}
