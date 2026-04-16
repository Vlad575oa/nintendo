import { Star, HelpCircle, TrendingUp, Heart, GitCompare, Share2 } from "lucide-react";

interface ProductMetaProps {
    productId: number;
}

export function ProductMeta({ productId }: ProductMetaProps) {
    return (
        <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-[11px] font-bold text-neutral-400 mb-8 pb-6 border-b border-neutral-100">
            {/* Rating */}
            <div className="flex items-center gap-2 pr-6 border-r border-neutral-100">
                <div className="flex items-center gap-0.5 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                </div>
                <span className="text-secondary text-xs">5</span>
                <span className="hover:text-primary cursor-pointer transition-colors">(1 отзыв)</span>
            </div>

            {/* Questions/Specs */}
            <div className="flex items-center gap-6 pr-6 border-r border-neutral-100">
                <div className="flex items-center gap-1.5 hover:text-secondary cursor-pointer transition-colors">
                    <HelpCircle size={14} className="opacity-50" />
                    <span>0 вопросов</span>
                </div>
                <div className="hover:text-primary cursor-pointer transition-colors">К характеристикам</div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-orange-500" />
                    <span>{3500 + productId} покупок</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 hover:text-secondary cursor-pointer transition-colors group">
                        <Heart size={14} className="group-hover:text-red-500 transition-colors" />
                        <span>В избранное</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-secondary cursor-pointer transition-colors">
                        <GitCompare size={14} />
                        <span>К сравнению</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-secondary cursor-pointer transition-colors">
                        <Share2 size={14} />
                        <span>Поделиться</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>{10 + (productId % 5)} сейчас просматривают</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icons shim if needed (lucide-react handles most)
function MessageSquareFull(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}
