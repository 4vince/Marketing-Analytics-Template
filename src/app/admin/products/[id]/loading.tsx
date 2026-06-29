// Edit product page loading skeleton — animated pulse placeholders for form fields.
export default function EditProductLoading() {
  return (
    <div>
      <div className="h-8 w-40 bg-brand-risen rounded animate-pulse mb-8" />
      <div className="max-w-lg space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 w-16 bg-brand-fence rounded animate-pulse" />
            <div className="h-10 w-full bg-brand-risen rounded animate-pulse" />
          </div>
        ))}
        <div className="h-10 w-32 bg-brand-risen rounded animate-pulse" />
      </div>
    </div>
  );
}
