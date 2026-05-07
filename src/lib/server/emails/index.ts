//mock email service

type SendVerificationEmailParams = {
	to: string;
	url: string;
	token: string;
};

export async function sendVerificationEmail({
	to,
	url,
	token,
}: SendVerificationEmailParams): Promise<void> {
	console.log(
		`Sending verification email to ${to} with url: ${url} and token: ${token}`,
	);
	return Promise.resolve();
}

export async function sendResetPasswordEmail({
	to,
	url,
	token,
}: SendVerificationEmailParams): Promise<void> {
	console.log(
		`Sending reset password email to ${to} with url: ${url} and token: ${token}`,
	);
	return Promise.resolve();
}

export async function sendDeleteAccountVerificationEmail({
	to,
	url,
	token,
}: SendVerificationEmailParams): Promise<void> {
	console.log(
		`Sending delete account verification email to ${to} with url: ${url} and token: ${token}`,
	);
	return Promise.resolve();
}
