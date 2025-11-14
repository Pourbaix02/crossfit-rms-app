import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wovfqdlfiaijsijqfbfj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdmZxZGxmaWFpanNpanFmYmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzUyMTYsImV4cCI6MjA3ODYxMTIxNn0.NrjdAAxwXD15oHlj3dZO5OgKOdC8wjQhH4Vqdfc8kaE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

