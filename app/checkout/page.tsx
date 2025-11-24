'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice, findProductById } from '@/lib/products';

export default function CheckoutPage() {
	const router = useRouter();
	const { items, total, clear } = useCart();
	const [submitting, setSubmitting] = useState(false);
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [country, setCountry] = useState('');
	const [province, setProvince] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
	const [paymentSlipPreview, setPaymentSlipPreview] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [qrCodeError, setQrCodeError] = useState(false);

	const hasItems = items.length > 0;

	const lines = useMemo(
		() =>
			items.map((i, index) => {
				const product = findProductById(i.productId);
				return (
					<div
						key={`${i.productId}-${i.size}-${index}`}
						style={{
							display: 'flex',
							gap: '1rem',
							padding: '1rem',
							borderBottom: '1px solid #ddd'
						}}
					>
						<div
							style={{
								position: 'relative',
								width: '100px',
								height: '100px',
								border: '1px solid #000000',
								background: '#ffffff',
								borderRadius: '4px',
								overflow: 'hidden',
								flexShrink: 0
							}}
						>
							{product?.image ? (
								<Image
									src={product.image}
									alt={i.name}
									fill
									style={{ objectFit: 'cover' }}
									sizes="100px"
								/>
							) : (
								<div style={{
									width: '100%',
									height: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#999',
									fontSize: '0.75rem'
								}}>
									No image
								</div>
							)}
						</div>
						<div style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							gap: '0.25rem'
						}}>
							<div style={{
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								color: '#000000',
								fontSize: '1rem',
								fontWeight: '500'
							}}>
								{i.name || 'Prototype'}
							</div>
							<div style={{
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								color: '#666',
								fontSize: '0.875rem'
							}}>
								Size: {i.size} × {i.quantity}
							</div>
							<div style={{
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								color: '#000000',
								fontSize: '0.875rem'
							}}>
								{formatPrice(i.price * i.quantity)}
							</div>
						</div>
					</div>
				);
			}),
		[items]
	);

	function handlePaymentSlipChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setPaymentSlip(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPaymentSlipPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name || !email || !phone || !address || !country || !province || !postalCode) {
			setMessage('Please fill in all required fields');
			return;
		}

		setSubmitting(true);
		setMessage(null);
		try {
			const formData = new FormData();
			formData.append('customerEmail', email);
			formData.append('customerName', name);
			formData.append('phone', phone);
			formData.append('address', address);
			formData.append('country', country);
			formData.append('province', province);
			formData.append('postalCode', postalCode);
			formData.append('items', JSON.stringify(items));
			formData.append('total', total.toString());
			if (paymentSlip) {
				formData.append('paymentSlip', paymentSlip);
			}

			const res = await fetch('/api/order', {
				method: 'POST',
				body: formData
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Checkout failed');
			
			setMessage('Order placed! Check your email for confirmation.');
			clear();
			setTimeout(() => {
				router.push('/');
			}, 2000);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Something went wrong';
			setMessage(msg);
		} finally {
			setSubmitting(false);
		}
	}

	if (!hasItems) {
		return (
			<div style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '2rem'
			}}>
				<h1 style={{
					fontFamily: 'var(--font-unifraktur), "Old English Text MT", "Blackletter", serif',
					fontSize: '2rem',
					fontWeight: 'normal',
					color: '#000000',
					marginBottom: '1rem'
				}}>
					Your cart is empty
				</h1>
				<button
					onClick={() => router.push('/shop')}
					style={{
						padding: '0.75rem 1.5rem',
						border: '1px solid #000000',
						background: '#ffffff',
						color: '#000000',
						cursor: 'pointer',
						fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
						fontSize: '1rem',
						borderRadius: '4px'
					}}
				>
					Continue Shopping
				</button>
			</div>
		);
	}

	return (
		<div style={{
			minHeight: '100vh',
			padding: '2rem',
			display: 'flex',
			flexDirection: 'column',
			maxWidth: '1200px',
			margin: '0 auto'
		}}>
			<h1 style={{
				fontFamily: 'var(--font-unifraktur), "Old English Text MT", "Blackletter", serif',
				fontSize: '2.5rem',
				fontWeight: 'normal',
				color: '#000000',
				marginBottom: '2rem',
				letterSpacing: '0.05em'
			}}>
				Checkout
			</h1>

			<div style={{
				display: 'grid',
				gridTemplateColumns: '1fr 500px',
				gap: '3rem',
				alignItems: 'start'
			}}>
				{/* Order Summary */}
				<div>
					<h2 style={{
						fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#000000',
						marginBottom: '1.5rem'
					}}>
						Order Summary
					</h2>
					<div style={{
						background: '#ffffff',
						border: '1px solid #ddd',
						borderRadius: '8px',
						overflow: 'hidden'
					}}>
						{lines}
					</div>
				</div>

				{/* Checkout Form */}
				<div>
					<h2 style={{
						fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#000000',
						marginBottom: '1.5rem'
					}}>
						Your Details
					</h2>
					<form onSubmit={handleSubmit} style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem'
					}}>
						<div>
							<label style={{
								display: 'block',
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '0.875rem',
								color: '#000000',
								marginBottom: '0.5rem',
								fontWeight: '500'
							}}>
								Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								style={{
									width: '100%',
									padding: '0.75rem',
									borderRadius: '8px',
									border: '1px solid #ddd',
									background: '#ffffff',
									color: '#000000',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1rem'
								}}
							/>
						</div>
						<div>
							<label style={{
								display: 'block',
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '0.875rem',
								color: '#000000',
								marginBottom: '0.5rem',
								fontWeight: '500'
							}}>
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								style={{
									width: '100%',
									padding: '0.75rem',
									borderRadius: '8px',
									border: '1px solid #ddd',
									background: '#ffffff',
									color: '#000000',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1rem'
								}}
							/>
						</div>
						<div>
							<label style={{
								display: 'block',
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '0.875rem',
								color: '#000000',
								marginBottom: '0.5rem',
								fontWeight: '500'
							}}>
								Phone Number
							</label>
							<input
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								required
								placeholder="e.g., +66 123 456 7890"
								style={{
									width: '100%',
									padding: '0.75rem',
									borderRadius: '8px',
									border: '1px solid #ddd',
									background: '#ffffff',
									color: '#000000',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1rem'
								}}
							/>
						</div>

						{/* Address Section */}
						<div>
							<h3 style={{
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '1.125rem',
								fontWeight: '600',
								color: '#000000',
								marginBottom: '1rem'
							}}>
								Shipping Address
							</h3>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
								<div>
									<label style={{
										display: 'block',
										fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
										fontSize: '0.875rem',
										color: '#000000',
										marginBottom: '0.5rem',
										fontWeight: '500'
									}}>
										Address
									</label>
									<textarea
										value={address}
										onChange={(e) => setAddress(e.target.value)}
										required
										placeholder="Street address, building, apartment, etc."
										rows={3}
										style={{
											width: '100%',
											padding: '0.75rem',
											borderRadius: '8px',
											border: '1px solid #ddd',
											background: '#ffffff',
											color: '#000000',
											fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
											fontSize: '1rem',
											resize: 'vertical'
										}}
									/>
								</div>
								<div>
									<label style={{
										display: 'block',
										fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
										fontSize: '0.875rem',
										color: '#000000',
										marginBottom: '0.5rem',
										fontWeight: '500'
									}}>
										Country
									</label>
									<input
										type="text"
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										required
										style={{
											width: '100%',
											padding: '0.75rem',
											borderRadius: '8px',
											border: '1px solid #ddd',
											background: '#ffffff',
											color: '#000000',
											fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
											fontSize: '1rem'
										}}
									/>
								</div>
								<div>
									<label style={{
										display: 'block',
										fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
										fontSize: '0.875rem',
										color: '#000000',
										marginBottom: '0.5rem',
										fontWeight: '500'
									}}>
										Province/State
									</label>
									<input
										type="text"
										value={province}
										onChange={(e) => setProvince(e.target.value)}
										required
										style={{
											width: '100%',
											padding: '0.75rem',
											borderRadius: '8px',
											border: '1px solid #ddd',
											background: '#ffffff',
											color: '#000000',
											fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
											fontSize: '1rem'
										}}
									/>
								</div>
								<div>
									<label style={{
										display: 'block',
										fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
										fontSize: '0.875rem',
										color: '#000000',
										marginBottom: '0.5rem',
										fontWeight: '500'
									}}>
										Postal Code
									</label>
									<input
										type="text"
										value={postalCode}
										onChange={(e) => setPostalCode(e.target.value)}
										required
										style={{
											width: '100%',
											padding: '0.75rem',
											borderRadius: '8px',
											border: '1px solid #ddd',
											background: '#ffffff',
											color: '#000000',
											fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
											fontSize: '1rem'
										}}
									/>
								</div>
							</div>
						</div>

						{/* Payment Section */}
						<div>
							<h3 style={{
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '1.125rem',
								fontWeight: '600',
								color: '#000000',
								marginBottom: '1rem'
							}}>
								Payment
							</h3>
							
							{/* QR Code PromptPay Box */}
							<div style={{
								background: '#ffffff',
								border: '1px solid #ddd',
								borderRadius: '8px',
								padding: '1.5rem',
								marginBottom: '1.5rem',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '1rem'
							}}>
								<div style={{
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1rem',
									fontWeight: '600',
									color: '#000000'
								}}>
									PromptPay QR Code
								</div>
								<div style={{
									width: '200px',
									height: '200px',
									border: '1px solid #ddd',
									borderRadius: '8px',
									position: 'relative',
									background: '#ffffff',
									overflow: 'hidden',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									{!qrCodeError ? (
										<Image
											src="/images/pooh qr code.jpeg"
											alt="PromptPay QR Code"
											width={200}
											height={200}
											onError={() => setQrCodeError(true)}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'contain'
											}}
										/>
									) : (
										<div style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											padding: '1rem',
											textAlign: 'center',
											gap: '0.5rem'
										}}>
											<div style={{
												fontSize: '2rem',
												color: '#999'
											}}>📷</div>
											<div style={{
												fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
												fontSize: '0.75rem',
												color: '#999'
											}}>
												QR code image not found
											</div>
											<div style={{
												fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
												fontSize: '0.65rem',
												color: '#999'
											}}>
												Save as: public/images/promptpay-qr.png
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Payment Slip Upload */}
							<div>
								<label style={{
									display: 'block',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '0.875rem',
									color: '#000000',
									marginBottom: '0.5rem',
									fontWeight: '500'
								}}>
									Upload Payment Slip
								</label>
								<div style={{
									border: '2px dashed #ddd',
									borderRadius: '8px',
									padding: '1.5rem',
									background: '#ffffff',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '1rem',
									minHeight: '200px',
									justifyContent: 'center'
								}}>
									{paymentSlipPreview ? (
										<div style={{
											width: '100%',
											display: 'flex',
											flexDirection: 'column',
											gap: '0.5rem',
											alignItems: 'center'
										}}>
											<Image
												src={paymentSlipPreview}
												alt="Payment slip preview"
												width={300}
												height={300}
												style={{
													maxWidth: '100%',
													height: 'auto',
													borderRadius: '4px',
													border: '1px solid #ddd'
												}}
											/>
											<button
												type="button"
												onClick={() => {
													setPaymentSlip(null);
													setPaymentSlipPreview(null);
												}}
												style={{
													padding: '0.5rem 1rem',
													border: '1px solid #ddd',
													background: '#ffffff',
													color: '#000000',
													cursor: 'pointer',
													fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
													fontSize: '0.875rem',
													borderRadius: '4px'
												}}
											>
												Remove
											</button>
										</div>
									) : (
										<>
											<div style={{
												fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
												fontSize: '0.875rem',
												color: '#666',
												textAlign: 'center'
											}}>
												Click or drag to upload payment slip
											</div>
											<label style={{
												padding: '0.75rem 1.5rem',
												border: '1px solid #000000',
												background: '#ffffff',
												color: '#000000',
												cursor: 'pointer',
												fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
												fontSize: '0.875rem',
												borderRadius: '4px',
												display: 'inline-block'
											}}>
												Choose File
												<input
													type="file"
													accept="image/*"
													onChange={handlePaymentSlipChange}
													style={{ display: 'none' }}
												/>
											</label>
										</>
									)}
								</div>
							</div>
						</div>

						<div style={{
							background: '#000000',
							padding: '1.5rem',
							borderRadius: '8px'
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '1.5rem'
							}}>
								<span style={{
									color: '#ffffff',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1rem'
								}}>
									Total
								</span>
								<span style={{
									color: '#ffffff',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1.25rem',
									fontWeight: '600'
								}}>
									{formatPrice(total)}
								</span>
							</div>
							<button
								type="submit"
								disabled={submitting || !name || !email || !phone || !address || !country || !province || !postalCode}
								style={{
									width: '100%',
									padding: '1rem',
									border: 'none',
									background: 'transparent',
									color: '#ffffff',
									cursor: (submitting || !name || !email || !phone || !address || !country || !province || !postalCode) ? 'not-allowed' : 'pointer',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
									fontSize: '1rem',
									fontWeight: '600',
									borderTop: '1px solid rgba(255, 255, 255, 0.2)',
									opacity: (submitting || !name || !email || !phone || !address || !country || !province || !postalCode) ? 0.6 : 1
								}}
							>
								{submitting ? 'Placing order...' : 'Place Order'}
							</button>
						</div>
						{message && (
							<div style={{
								padding: '1rem',
								borderRadius: '8px',
								border: '1px solid',
								borderColor: message.includes('Order placed') ? '#4ade80' : '#ef4444',
								background: message.includes('Order placed') ? '#f0fdf4' : '#fef2f2',
								color: message.includes('Order placed') ? '#166534' : '#991b1b',
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '0.875rem'
							}}>
								{message}
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

