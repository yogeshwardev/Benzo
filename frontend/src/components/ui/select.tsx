import * as React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, onValueChange, onChange, ...props }, ref) => (
    <select
      className={'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' + className}
      ref={ref}
      onChange={(e) => {
        if (onChange) onChange(e)
        if (onValueChange) onValueChange(e.target.value)
      }}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'
export const SelectValue = ({ placeholder }: { placeholder?: string }) => null
export const SelectTrigger = ({ children, className = '' }: any) => <div className={className}>{children}</div>
export const SelectContent = ({ children }: any) => <>{children}</>
export const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => <option value={value}>{children}</option>
