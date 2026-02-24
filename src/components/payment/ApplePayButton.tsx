'use client';

interface ApplePayButtonProps {
  amount: number;
  onSuccess: () => void;
}

export function ApplePayButton({ amount, onSuccess }: ApplePayButtonProps) {
  return (
    <div>
      <button
        onClick={onSuccess}
        className="w-full py-4 bg-[#0a0a0a] text-white rounded-[13px] text-[19px] font-semibold flex items-center justify-center gap-2 border-none cursor-pointer hover:bg-[#1a1a1a] hover:scale-[0.99] active:scale-[0.97] transition-all"
      >
        <span style={{ fontFamily: '-apple-system, system-ui' }}></span> Pay ${amount}
      </button>

      <div className="flex items-center gap-2.5 my-4">
        <span className="flex-1 h-px bg-[#eee]" />
        <span className="text-[11px] text-[#ccc]">or pay another way</span>
        <span className="flex-1 h-px bg-[#eee]" />
      </div>

      <p className="text-[12px] text-[#bbb] text-center leading-[1.7]">
        Use Face ID or Touch ID to complete your purchase instantly.
        Your payment info is never shared.
      </p>
    </div>
  );
}
