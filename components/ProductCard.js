'use client';

import { motion } from 'framer-motion';

export default function ProductCard({ product, onBuy }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-zinc-100 p-4 hover:shadow-md hover:shadow-violet-100/50 hover:border-violet-200/50 transition-all duration-300 flex flex-col"
        >
            {product.imageUrl?.trim() && (
                <div className="mb-3 rounded-xl overflow-hidden aspect-[4/3] bg-zinc-50">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}

            <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug">{product.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200 whitespace-nowrap">
                        {product.category}
                    </span>
                </div>

                <p className="text-lg font-bold text-slate-900 mt-auto pt-3">{product.priceDisplay}</p>

                <button
                    onClick={() => onBuy(product)}
                    className="mt-3 w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.97] shadow-sm shadow-violet-600/20"
                >
                    Buy Now
                </button>
            </div>
        </motion.div>
    );
}
