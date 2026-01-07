export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString()
}

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(Number(amount))
}

export const formatText = (value) => value ?? '—'

export const statusLabel = (status) => {
  if (!status) return '—'
  return status.replace('_', ' ').toUpperCase()
}
