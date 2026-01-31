import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-light tracking-tight text-gray-900 mb-2">FlexCore</h3>
                    <p className="text-gray-500 text-sm">Elevate your daily routine.</p>
                </div>

                <div className="flex gap-8 text-sm text-gray-600">
                    <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Support</Link>
                </div>

                <p className="text-gray-400 text-xs">© 2026 FlexCore Inc.</p>
            </div>
        </footer>
    );
}
